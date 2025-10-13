import Scaffold from '../components/Scaffold';

export default function ContactPage({ scaffoldProps = {} }) {
    return (
        <Scaffold {...scaffoldProps}>
            <div className="flex flex-col items-center bg-black text-white">
                <div className="flex flex-col items-center justify-center flex-grow pt-20">
                    <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
                    <p className="text-lg mb-8">Feel free to reach out via email or connect on social media!</p>
                    <div className="space-y-4">
                        <div>
                            <strong>Email:</strong> <a href="mailto:jackmeng0814@gmail.com" className="text-blue-400 hover:underline">
                            </a>
                        </div>
                        <div>
                            <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jiaming-meng-0814/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">linkedin.com/in/jiaming-meng-0814/</a>
                        </div>
                        <div>
                            <strong>GitHub:</strong> <a href="https://github.com/exoad" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/exoad</a>
                        </div>
                    </div>
                </div>
            </div>
        </Scaffold>
    );
}