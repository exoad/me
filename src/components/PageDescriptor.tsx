export default function PageDescriptor({ title, description }: Readonly<{ title: string; description: string; }>) {
    return <div className="flex flex-col items-center gap-8 max-w-3xl px-4 sm:px-6 pt-[6rem]">
        <h1 className="animate-fade-in text-6xl lg:text-7xl font-bold font-playfair text-center">
            {title}
        </h1>
        <div className="animate-fade-in" >
            <div className="w-24 h-px bg-white" />
        </div>
        <p className="text-white text-lg text-center max-w-2xl mx-auto font-montserrat leading-relaxed mb-12">
            {description}
        </p>
    </div>;
}