'use client';
import notFoundImg from 'assets/images/404.png';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className={'main-content-inner px-[16px] md:px-[32px] w-full flex items-center justify-center'}>
      <div className="flex flex-col justify-center items-center">
        <Image width={400} height={240} src={notFoundImg} alt="not found" className="w-[240px] md:w-[400px]" />
        <span className="mt-[48px] text-neutralTitle text-6xl font-semibold">404</span>
        <span className="mt-[16px] text-neutralSecondary text-lg font-medium">
          The specified customised link does not exist.
        </span>
      </div>
    </div>
  );
};

export default NotFound;
