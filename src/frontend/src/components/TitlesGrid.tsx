import TitleCard from './TitleCard';
import { Title } from '../backend';

interface TitlesGridProps {
  titles: Title[];
}

export default function TitlesGrid({ titles }: TitlesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {titles.map((title) => (
        <TitleCard key={title.id.toString()} title={title} />
      ))}
    </div>
  );
}
