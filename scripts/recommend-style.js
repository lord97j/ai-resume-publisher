const args = parseArgs(process.argv.slice(2));
const role = String(args.role || args._.join(" ")).toLowerCase();

const rules = [
  {
    style: "linear",
    match: ["backend", "后端", "架构", "architect", "security", "安全", "infra", "devops", "底层", "driver"],
    reason: "dark, dense, precise engineering language for infrastructure-heavy roles"
  },
  {
    style: "stripe",
    match: ["pm", "growth", "增长", "sales", "销售", "saas", "business", "商业", "全栈", "fullstack"],
    reason: "premium SaaS polish with gradients and business-facing confidence"
  },
  {
    style: "claude",
    match: ["research", "研究", "algorithm", "算法", "ai", "prompt", "内容", "market", "策划"],
    reason: "warm editorial typography for research depth and strong writing"
  },
  {
    style: "notion",
    match: ["project", "项目", "运营", "operation", "admin", "行政", "新人", "junior", "pmp"],
    reason: "document-like structure for clarity, organization, and collaboration"
  },
  {
    style: "vercel",
    match: ["frontend", "前端", "ui", "ux", "web", "startup", "初创"],
    reason: "monochrome precision for modern frontend and fast iteration roles"
  }
];

const result = rules.find((rule) => rule.match.some((keyword) => role.includes(keyword))) || rules[4];
console.log(JSON.stringify(result, null, 2));

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index].startsWith("--")) {
      parsed[argv[index].slice(2)] = argv[index + 1] && !argv[index + 1].startsWith("--") ? argv[++index] : true;
    } else {
      parsed._.push(argv[index]);
    }
  }
  return parsed;
}
