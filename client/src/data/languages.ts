export interface Language {
  name: string;
  abbr: string;
  available: boolean;
}

const languagesArray: Language[] = [
  { name: "C++", abbr: "cpp", available: false },
  { name: "C", abbr: "c", available: false },
  { name: "Java", abbr: "java", available: false },
  { name: "Python", abbr: "python", available: false },
  { name: "JavaScript", abbr: "javascript", available: true },
  { name: "TypeScript", abbr: "ts", available: false },
  { name: "C#", abbr: "cs", available: false },
  { name: "Ruby", abbr: "rb", available: false },
  { name: "Go", abbr: "go", available: false },
  { name: "Rust", abbr: "rs", available: false },
  { name: "Kotlin", abbr: "kt", available: false },
  { name: "Swift", abbr: "swift", available: false },
  { name: "PHP", abbr: "php", available: false },
  { name: "Scala", abbr: "scala", available: false },
  { name: "Perl", abbr: "pl", available: false },
  { name: "R", abbr: "r", available: false },
  { name: "Bash", abbr: "bash", available: false },
  { name: "Lua", abbr: "lua", available: false },
  { name: "SQL", abbr: "sql", available: false },
  { name: "Dart", abbr: "dart", available: false },
  { name: "Haskell", abbr: "hs", available: false },
  { name: "Groovy", abbr: "groovy", available: false },
  { name: "Objective-C", abbr: "objc", available: false },
  { name: "Plaintext", abbr: "txt", available: false },
];

export default languagesArray;
