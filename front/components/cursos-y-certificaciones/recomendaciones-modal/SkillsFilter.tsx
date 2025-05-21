function SkillsFilter({
  allSkillsNames,
  setSelectedSkill,
  selectedSkill,
}: {
  allSkillsNames: string[];
  setSelectedSkill: React.Dispatch<React.SetStateAction<string[] | null>>;
  selectedSkill: string[] | null;
}) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap pt-6">
        {allSkillsNames.map((skill) => {
          return (
            <button
              key={skill}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => {
                if (selectedSkill?.includes(skill)) {
                  setSelectedSkill(selectedSkill.filter((s) => s !== skill));
                } else {
                  setSelectedSkill([...(selectedSkill || []), skill]);
                }
              }}
            >
              {skill}
            </button>
          );
        })}
      </div>
      <p className="pt-6">
        Habilidades elegidas: {selectedSkill?.join(", ") || "Ninguna"}
      </p>
    </div>
  );
}

export default SkillsFilter;
