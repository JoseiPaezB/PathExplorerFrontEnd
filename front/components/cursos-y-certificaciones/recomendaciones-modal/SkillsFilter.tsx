function SkillsFilter({
  allSkillsNames,
  setSelectedSkill,
  selectedSkill,
}: {
  allSkillsNames: string[];
  setSelectedSkill: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSkill: string | null;
}) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap pt-6">
        {allSkillsNames.map((skill) => {
          const isSelected = selectedSkill === skill;
          return (
            <button
              key={skill}
              className={`
                flex items-center gap-2 rounded-md border px-2 py-1 text-sm font-medium 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                transition-all duration-200 ease-in-out transform
                ${
                  isSelected
                    ? "border-purple-500 bg-purple-600 text-white shadow-md scale-105"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:scale-102"
                }
              `}
              onClick={() => {
                setSelectedSkill(skill);
              }}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SkillsFilter;
