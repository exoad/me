import { TTechnology } from '../types';
import { Row } from './FlexLayouter';

export default function ProjectsColorBar(props: Readonly<{ ref: string; isSmall?: boolean; technologies: Readonly<TTechnology[]>; }>) {
    return (<Row gap={0}>
        {props.isSmall ? props.technologies.map((t, _) => (
            <div
                key={`${t.name}-${props.ref}`}
                className="px-2 py-0.5 border-b-1"
                style={{ borderBottomColor: t.color }}
            >
                <Row gap={2} className="text-xs">
                    <span style={{ color: t.color }}> <t.icon /></span>
                    <span className="font-montserrat py-1 text-white">
                        {t.name}
                    </span>
                </Row>
            </div>)) : props.technologies.map((t, _) => (
                <div
                    key={`${t.name}-${props.ref}`}
                    className="px-1.5 py-0.5 text-black"
                    style={{ backgroundColor: t.color }}
                >
                    <Row gap={2} className="text-sm">
                        <t.icon />
                        <span className="font-montserrat">
                            {t.name}
                        </span>
                    </Row>
                </div>
            ))}
    </Row>);
}