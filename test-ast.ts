import { remark } from "remark";
import remarkParse from "remark-parse/lib";

const processor = remark().use(remarkParse);
const ast = processor.parse("# Hello\n\nThis is a paragraph\n\n## Subheading\n\nMore text");
console.log(JSON.stringify(ast, null, 2));
