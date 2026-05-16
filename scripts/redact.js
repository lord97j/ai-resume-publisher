export function redactResume(resume) {
  const clone = structuredClone(resume);
  const fields = new Set(clone.publisher?.redact || []);

  if (fields.has("email") && clone.basics?.email) {
    clone.basics.email = "Available in private resume";
  }

  if (fields.has("phone") && clone.basics?.phone) {
    clone.basics.phone = "Available in private resume";
  }

  if (fields.has("location") && clone.basics?.location) {
    clone.basics.location = {
      city: clone.basics.location.city || "",
      region: clone.basics.location.region || "",
      countryCode: clone.basics.location.countryCode || ""
    };
    delete clone.basics.location.address;
    delete clone.basics.location.postalCode;
  }

  if ((fields.has("company") || fields.has("work.name")) && Array.isArray(clone.work)) {
    for (const item of clone.work) {
      if (item.name) item.name = maskMiddle(item.name);
    }
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
