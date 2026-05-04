export default function Divider(props: Readonly<{ className?: string; }>) {
    return <div className={`w-[60%] h-px bg-gb-fg2 ${props.className ?? ""}`} />;
}