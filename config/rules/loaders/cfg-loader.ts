// function dataHander(source: string): string {
//   return JSON.stringify(source)
//     .replace(/\u2028/g, "\\u2028")
//     .replace(/\u2029/g, "\\u2029");
// }

function cfgFormat(txt: string): string[] {
  return txt.split(/[(\r\n)\r\n]+/);
}

const formatData = (txts: string[]): Record<string, number>[] =>
  txts.map(v => {
    const longitude = parseFloat(v.substr(18, 8));
    const latitude = parseFloat(v.substr(26, 8));
    const height = parseFloat(v.substr(34, 5));

    const pitch = parseFloat(v.substr(39, 8));
    const heading = parseFloat(v.substr(47, 8));
    const roll = parseFloat(v.substr(55, 8));
    return { latitude, longitude, height, pitch, heading, roll };
  });

export default function(source: string): string {
  return `module.exports=${JSON.stringify(formatData(cfgFormat(source)))}`;
}
