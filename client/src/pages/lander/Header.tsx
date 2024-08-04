import { Image } from "@nextui-org/react";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center py-5 pt-20 mx-[20%]">
      <h1 className="font-poly text-7xl text-center drop-shadow-glow">
        Learn, {`{Code}`} and Compete, all in one place.
      </h1>
      <div className="mt-20">
        <Image src="/lander.png" alt="Logo" isBlurred />
      </div>

      <pre className="opacity-50 text-3xl  mt-20">
        Experience a versatile, innovative coding platform: designed for {'\n'}
        assessments, development, and learning. With deep expertise in coding {'\n'}
        challenges and enterprise hiring solutions, our platform seamlessly {'\n'}
        integrates with your objectives. Dedicated to delivering fast results {'\n'}
        and enhancing your skills, while efficiently addressing your hiring {'\n'}
        needs.
      </pre>
    </div>
  );
};

export default Header;
