export function redactResume(resume) {
  const clone = structuredClone(resume);
  const fields = new Set(clone.publisher?.redact || []);
  const shouldRedactCompany = fields.has("company") || fields.has("work.name");
  const companyMap = shouldRedactCompany ? buildCompanyMap(clone.work || []) : [];

  if ((fields.has("email") || fields.has("contact")) && clone.basics?.email) {
    clone.basics.email = "Available in private resume";
  }

  if ((fields.has("phone") || fields.has("contact")) && clone.basics?.phone) {
    clone.basics.phone = "Available in private resume";
  }

  if (fields.has("location") && clone.basics?.location) {
    clone.basics.location = {};
  }

  if ((fields.has("profiles") || fields.has("contact")) && clone.basics?.profiles) {
    clone.basics.profiles = [];
  }

  if (shouldRedactCompany) {
    replaceCompanyNames(clone, companyMap);
  }

  return clone;
}

export function publicContactItems(resume) {
  const basics = resume.basics || {};
  const location = basics.location || {};
  const items = [];

  if (basics.email) items.push({ label: "Email", value: basics.email });
  if (basics.phone) items.push({ label: "Phone", value: basics.phone });

  const place = [location.city, location.region, location.countryCode].filter(Boolean).join(", ");
  if (place) items.push({ label: "Location", value: place });

  for (const profile of basics.profiles || []) {
    items.push({
      label: profile.network || "Profile",
      value: profile.url || profile.username || ""
    });
  }

  return items.filter((item) => item.value);
}

function maskMiddle(value) {
  const chars = Array.from(String(value).trim());
  if (chars.length <= 1) return chars.join("");
  if (chars.length === 2) return `${chars[0]}**`;

  const edge = chars.length <= 4 ? 1 : 2;
  return `${chars.slice(0, edge).join("")}**${chars.slice(-edge).join("")}`;
}

function buildCompanyMap(items) {
  const aliases = new Set();
  for (const item of items) {
    for (const alias of companyAliases(item.name || "")) {
      if (alias.length >= 2) aliases.add(alias);
    }
  }

  return [...aliases]
    .sort((a, b) => b.length - a.length)
    .map((alias) => [alias, maskMiddle(alias)]);
}

function companyAliases(value) {
  const text = String(value).trim();
  if (!text) return [];

  const aliases = new Set([text]);
  const bracketMatches = text.matchAll(/[（(]([^（）()]+)[）)]/g);
  for (const match of bracketMatches) aliases.add(match[1].trim());

  const withoutBracket = text.replace(/[（(][^（）()]+[）)]/g, "").trim();
  if (withoutBracket) aliases.add(withoutBracket);

  const shortName = withoutBracket
    .replace(/^(北京|上海|广州|深圳|杭州|南京|成都|武汉|西安|中国)/, "")
    .replace(/(信息安全技术有限公司|科技有限公司|股份有限公司|技术有限公司|有限公司|公司)$/g, "")
    .trim();
  if (shortName) aliases.add(shortName);

  return [...aliases];
}

function replaceCompanyNames(value, companyMap) {
  if (!value || !companyMap.length) return value;

  if (typeof value === "string") {
    return companyMap.reduce((text, [needle, replacement]) => text.replaceAll(needle, replacement), value);
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      value[index] = replaceCompanyNames(value[index], companyMap);
    }
    return value;
  }

  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      value[key] = replaceCompanyNames(value[key], companyMap);
    }
  }

  return value;
}
