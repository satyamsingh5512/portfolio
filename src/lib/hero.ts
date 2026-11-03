export interface TemplateSkill {
  name: string;
  href: string;
}

export const parseTemplate = <S extends TemplateSkill>(
  template: string,
  skills: S[],
) => {
  const parts = template.split(/(\{skills:\d+\})/);

  return parts
    .map((part, index) => {
      const skillMatch = part.match(/\{skills:(\d+)\}/);
      if (skillMatch) {
        const skillIndex = parseInt(skillMatch[1]);
        const skill = skills[skillIndex];
        if (skill) {
          return {
            type: "skill",
            skill: skill,
            key: index,
          };
        }
      }

      const boldParts = part.split(/(<b>.*?<\/b>)/);
      return boldParts.map((boldPart, boldIndex) => {
        if (boldPart.startsWith("<b>") && boldPart.endsWith("</b>")) {
          return {
            type: "bold",
            text: boldPart.slice(3, -4),
            key: `${index}-${boldIndex}`,
          };
        }
        return {
          type: "text",
          text: boldPart,
          key: `${index}-${boldIndex}`,
        };
      });
    })
    .flat();
};

export const parseBoldText = (text: string) => {
  const parts = text.split(/(<b>.*?<\/b>)/);
  return parts.map((part, index) => {
    if (part.startsWith("<b>") && part.endsWith("</b>")) {
      return {
        text: part.slice(3, -4),
        bold: true,
        key: index,
      };
    }
    return {
      text: part,
      bold: false,
      key: index,
    };
  });
};

const SKILL_REF = /\{skills:(\d+)\}/g;

/** Indices of `skills` that the template places inline via `{skills:N}`. */
export const referencedSkillIndices = (template: string): Set<number> =>
  new Set(Array.from(template.matchAll(SKILL_REF), (m) => Number(m[1])));

/**
 * Keeps `{skills:N}` references pointing at the same skills after the skill at
 * `removed` is deleted: its own reference is dropped and later ones shift down.
 */
export const removeSkillReference = (template: string, removed: number) =>
  template.replace(SKILL_REF, (match, n: string) => {
    const index = Number(n);
    if (index === removed) return "";
    return index > removed ? `{skills:${index - 1}}` : match;
  });
