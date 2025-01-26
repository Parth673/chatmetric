"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  data: { text: string; value: number }[];
};



const WordCloud = ({ data }: Props) => {
  const theme = useTheme();
  const router = useRouter();

  const fontSizeMap = (word: { value: number }) => Math.log2(word.value);

  return (
    <>
      <D3WordCloud
        data={data}
        height={550}
        font="Times"
        fontSize={fontSizeMap}
        rotate={90}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
        // onWordClick={(e, d) => {
        //   router.push("/quiz?topic=" + d.text);
        // }}
      />
    </>
  );
};

export default WordCloud;