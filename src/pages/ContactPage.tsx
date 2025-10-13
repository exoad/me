import PageDescriptor from '../components/PageDescriptor.tsx';
import Scaffold from '../components/Scaffold';
import { strings } from '../data/shared.ts';

export default function ContactPage({ scaffoldProps = {} }) {
    return (
        <Scaffold {...scaffoldProps}>
            <div className="flex flex-col items-center bg-black text-white">
                <PageDescriptor title={strings.pages.contact.title} description={strings.pages.contact.description} />
            </div>
        </Scaffold>
    );
}