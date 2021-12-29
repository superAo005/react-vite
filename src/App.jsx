import 'monaco-editor/min/vs/editor/editor.main.css'

const codeVal = `/*
Basic Java example using FizzBuzz
*/

import java.util.Random;

public class Example {
public static void main (String[] args){
  // Generate a random number between 1-100. (See generateRandomNumber method.)
  int random = generateRandomNumber(100);

  // Output generated number.
  System.out.println("Generated number: " + random + " ");

  // Loop between 1 and the number we just generated.
  for (int i=1; i<=random; i++){
    // If i is divisible by both 3 and 5, output "FizzBuzz".
    if (i % 3 == 0 && i % 5 == 0){
      System.out.println("FizzBuzzsdssadasd");
    }
    // If i is divisible by 3, output "Fizz"
    else if (i % 3 == 0){
      System.out.println("F");
    }
    // If i is divisible by 5, output "Buzz".
    else if (i % 5 == 0){
      System.out.println("Buzz");
    }
    // If i is not divisible by either 3 or 5, output the number.
    else {
      System.out.println(i);
    }
  }
}

/**
  Generates a new random number between 0 and 100.
  @param bound The highest number that should be generated.
  @return An integer representing a randomly generated number between 0 and 100.
*/
private static int generateRandomNumber(int bound){
  // Create new Random generator object and generate the random number.
  Random randGen = new Random();
  int randomNum = randGen.nextInt(bound);

  // If the random number generated is zero, use recursion to regenerate the number until it is not zero.
  if (randomNum < 1){
    randomNum = generateRandomNumber(bound);
  }

  return randomNum;
}
}
`

import DetailConfig from '@/components/DetailConfig'

// import { RiskEditor } from '@/components/RiskEditor'
import CodeEditor from '@/components/CodeEditor'
import Test from '@/components/DetailConfig/test'
// https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
const editor_option = {
  automaticLayout: true, // 自适应布局
  scrollBeyondLastLine: true, // 取消代码后面空白
  fixedOverflowWidgets: false, // 超出编辑器大小的使用fixed属性显示
  theme: 'vs-light',
  // fontFamily: "Fira Code,Source Code Pro, Consolas, 'Courier New', monospace",
  // fontLigatures: true,
  // language: 'javascript',
  language: 'java',
  // selectOnLineNumbers: true,
  // roundedSelection: false,
  readOnly: false,
  cursorStyle: 'line', //光标风格"line" | "block" | "underline" | "line-thin" | "block-outline" | "underline-thin"
  wordWrap: true, //折行展示
  //   minimap: {
  //     enabled: false, // 不要小地图
  //   },
}

const App = () => {
  const handleChange = (val) => {
    // console.log(val)
  }
  const editorDidMount = (editor, monaco) => {
    // console.log(editor, monaco)
  }
  return (
    <div>
      <header className="space-y-4 h-screen flex flex-col  items-center justify-center text-white">
        {/* <img
          src={logo}
          className="App-logo pointer-events-none h-2/5 motion-safe:animate-spin-slow"
          alt="logo"
        /> */}
        {/* <Counter /> */}
        {/* <CodeEditor
          className="cursor-auto"
          value={codeVal}
          onChange={handleChange}
          options={editor_option}
          editorDidMount={editorDidMount}></CodeEditor> */}

        <div className="w-[1200px] h-[300px]">
          <Test></Test>
        </div>
      </header>
    </div>
  )
}

export default App
