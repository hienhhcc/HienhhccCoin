import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Block from './Block';
import { IBlock } from './Block.interface';
import './Blocks.css';

const Blocks: React.FC = () => {
  const { data, error } = useSWR('backend' + '/blocks');
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  console.log(data);

  useEffect(() => {
    if (data) {
      setBlocks(data.blocks);
    }
  }, [data]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="containerrr">
      <h3>Blocks</h3>
      {blocks.map((block) => {
        return <Block key={block.hash} block={block} />;
      })}
    </div>
  );
};

export default Blocks;
