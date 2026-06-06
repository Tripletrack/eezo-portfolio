import Image from "next/image";

type Props = {
  youtubeId: string;
  title: string;
};

export default function VideoStills({ youtubeId, title }: Props) {
  const stills = [
    `https://img.youtube.com/vi/${youtubeId}/1.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/2.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/3.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/sddefault.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/0.jpg`,
    `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
  ];

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2px",
          marginTop: "2px",
        }}
      >
        {stills.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              aspectRatio: "16/9",
              overflow: "hidden",
              background: "#111",
            }}
          >
            <Image
              src={src}
              alt={`${title} still ${i + 1}`}
              fill
              sizes="25vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
