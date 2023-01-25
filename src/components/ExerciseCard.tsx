import {
  CommandLineIcon,
  DocumentTextIcon,
  FlagIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { Activity } from "../server/schema/LearnerActivitySchema";

const ExerciseCard = ({
  name,
  type,
  successRate,
  attempts,
}: {
  name: string;
  type: string;
  successRate: number;
  attempts: number;
}) => {
  return (
    <div
      className={`grid h-72 w-full rounded ${
        successRate > 0 || (attempts > 0 && type == "EXAMPLE")
          ? `bg-emerald-100 dark:bg-emerald-800`
          : attempts > 0 && successRate == 0 && type !== "EXAMPLE"
          ? `bg-yellow-100 dark:bg-orange-400`
          : `course-card`
      }`}
    >
      <p className="text-color px-4 pt-4 text-lg font-semibold">{name}</p>
      <div className="grid justify-items-center">
        <div
          className={`flex h-28 w-28 flex-row items-stretch rounded-full p-4 ${
            successRate > 0 || (attempts > 0 && type == "EXAMPLE")
              ? `bg-emerald-300 dark:bg-emerald-900`
              : attempts > 0 && successRate == 0 && type !== "EXAMPLE"
              ? `bg-yellow-200 dark:bg-orange-600`
              : `bg-blue-200 dark:bg-[#1d203a]`
          }`}
        >
          {type == "EXAMPLE" && attempts == 0 ? (
            <DocumentTextIcon className=" text-white" />
          ) : type == "CODING" && successRate == 0 ? (
            <CommandLineIcon className=" text-white" />
          ) : type == "CHALLENGE" && successRate == 0 ? (
            <FlagIcon className=" text-white" />
          ) : (
            <CheckCircleIcon className=" text-white" />
          )}
        </div>
      </div>
      <div className="mx-4 flex flex-row justify-between">
        <p className="text-color text-sm font-semibold">{type}</p>
        {type == "EXAMPLE" ? (
          <></>
        ) : (
          <p className="text-color text-sm">{attempts} attempts</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;