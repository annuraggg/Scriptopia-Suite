import { ContainerScroll } from "@/components/container-scroll-animation";

function Header() {
  return (
    <div>
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center justify-center">
            <img src="/logo.png" alt="logo" className="w-20 mb-5" />
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Learn, Code, Compete <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                All in One Place
              </span>
            </h1>
          </div>
        }
      >
        <img
          src={`/lander.png`}
          alt="hero"
    
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}

export default Header;
