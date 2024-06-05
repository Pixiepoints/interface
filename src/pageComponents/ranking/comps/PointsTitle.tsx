import { Tooltip } from 'aelf-design';
import { ReactComponent as QuestionIconComp } from 'assets/images/icons/questionCircleOutlined.svg';

export default function PointsTitle({ title, tip }: { title: string; tip: string }) {
  return (
    <div className="flex items-center">
      <Tooltip title={tip}>
        <QuestionIconComp className="w-4 h-4 mr-1 cursor-pointer" width={16} height={16} />
      </Tooltip>
      <span>{title}</span>
    </div>
  );
}
