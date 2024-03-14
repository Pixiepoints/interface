import React, { useState } from 'react';
import { Input } from 'antd';
import RichText from 'components/RichText';

export default function Home() {
  const [val, setVal] = useState();
  const [val2, setVal2] = useState('');
  return (
    <div className="w-full">
      <Input.TextArea
        value={val}
        onChange={(e: any) => {
          const encode = encodeURIComponent(e.target.value);
          console.log(encode);
          const decode = decodeURIComponent(encode);
          console.log(decode);
          setVal2(decode);
          setVal(e.target.value);
        }}
      />
      <RichText text={val2} />
    </div>
  );
}
