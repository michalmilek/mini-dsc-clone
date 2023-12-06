interface Props {
  name: string;
  type: "channel" | "conversation";
}

export const ChatWelcome = ({ name, type }: Props) => {
  const h3ClassName = "text-2xl font-bold";
  return (
    <div className="px-4 py-4">
      {type === "channel" && (
        <>
          <h3 className={h3ClassName}>Welcome to #{name}!</h3>
          <p>This is a start of the #{name} conversation.</p>
        </>
      )}
      {type === "conversation" && (
        <>
          <h3 className={h3ClassName}>Welcome to {name} conversation!</h3>
          <p>This is a start of the {name} conversation.</p>
        </>
      )}
    </div>
  );
};
