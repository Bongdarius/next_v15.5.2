import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", 'prettier'),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // ########## Airbnb-like Rules ##########

      // ## Best Practices (오류 방지 및 코드 품질)
      "eqeqeq": ["error", "always"], // '===' 와 '!==' 만 허용
      "no-var": "error", // 'var' 사용 금지
      "prefer-const": "error", // 재할당되지 않는 변수는 'const' 사용
      "no-console": ["warn", { "allow": ["warn", "error"] }], // console.log 사용 시 경고
      "no-param-reassign": "error", // 함수 파라미터 재할당 금지
      "@typescript-eslint/no-unused-vars": "warn", // 사용되지 않는 변수 경고

      // ## Stylistic Issues (코드 스타일)
      "arrow-body-style": ["error", "as-needed"], // 화살표 함수 본문이 한 줄일 경우 중괄호 생략

      // ## React / JSX Rules
      "react/self-closing-comp": "error", // 자식 없는 컴포넌는 셀프 클로징 사용
      "react/jsx-no-useless-fragment": "warn", // 불필요한 Fragment 사용 시 경고
      "react/jsx-key": "error", // 배열/이터레이터 사용 시 key 속성 강제

      // ## React Hooks Rules (이미 next/core-web-vitals에 포함되어 있지만 명시적으로 강조)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ## Accessibility (웹 접근성)
      "jsx-a11y/alt-text": "warn", // <img> 태그에 alt 속성 강제
      "jsx-a11y/anchor-is-valid": "warn", // <a> 태그 사용 규칙 (Next.js의 <Link>와 함께 중요)
    },
  },
];

export default eslintConfig;