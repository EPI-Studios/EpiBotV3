import type { GuildMember } from "discord.js";
import db from "../utils/db";
import schemas from "../schemas";
import { eq } from "drizzle-orm";
import leveling from "../settings/leveling.json";

export default {
  width: 800,
  height: 300,
  element: async function Welcome(options: { member: GuildMember }) {
    const profile = await db
      .select()
      .from(schemas.profiles)
      .where(eq(schemas.profiles.userId, options.member.id))
      .get();

    if (!profile) return;

    const totalXpToReach =
      leveling.baseExperienceNeeded + profile.level * leveling.perLevel;
    const progress =
      totalXpToReach > 0 ? (profile.experience / totalXpToReach) * 100 : 0;

    return (
      <div style={{ display: "contents" }}>
        <img
          src="https://iili.io/BmxhmHG.md.jpg"
          style={{
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "50%",
            left: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            padding: "15px",
            height: "130px",
            width: "600",
            borderRadius: "30px",
            gap: "30px",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={options.member.user.displayAvatarURL({ extension: "jpg" })}
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50%",
            }}
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              transform: "translateY(-10px)",
            }}
          >
            <h1>{options.member.user.displayName}</h1>
            <div
              style={{
                width: "300px",
                marginInline: "4%",
                display: "flex",
                backgroundColor: "white",
                padding: "5px",
                height: "20px",
                borderRadius: "50px",
                alignItems: "center",
                transform: "translateY(-5px)",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor: "pink",
                  width: progress + "%",
                  height: "13px",
                  borderRadius: "50px",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div
          className="level"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: "80px",
            right: "100px",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
          }}
        >
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "sans-serif",
              fontSize: "28px",
              borderRadius: "50%",
              border: "1px solid black",
              boxShadow: "1px 1px 1px black",
            }}
          >
            {profile.level}
          </h1>
        </div>
      </div>
    );
  },
};
