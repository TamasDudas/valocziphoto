interface Props {
  aboutImage: string;
  title: string;
  text: React.ReactNode;
  alt?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export default function Banner({
  aboutImage,
  title,
  text,
  alt = 'Eszter és Laci',
  headingLevel = 'h2',
}: Props) {
  const HeadingTag = headingLevel;
  const headingClass =
    headingLevel === 'h1'
      ? 'mt-4 mb-8 text-center text-3xl font-bold'
      : 'mt-4 mb-8 text-center text-6xl';

  return (
    <>
      <HeadingTag className={headingClass}>{title}</HeadingTag>
      <div className="my-8 flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-1/2">
          <img
            src={aboutImage}
            alt={alt}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
        <div className="w-full px-8 lg:m-auto lg:w-1/2">{text}</div>
      </div>
    </>
  );
}
