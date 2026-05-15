import type { GuildMember } from "discord.js";

export default {
  width: 700,
  height: 300,
  element: function Welcome(options: { member: GuildMember }) {
    return (
      <div style={{ display: "contents" }}>
        <img
          src="https://iili.io/BmxhmHG.md.jpg"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
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
            }}
          >
            <h1>Au-revoir {options.member.user.displayName}</h1>
            <p style={{ transform: "translateY(-20px)" }}>
              EPI Studio te souhaite un bon départ...
            </p>
          </div>
        </div>
      </div>
    );
  },
};
