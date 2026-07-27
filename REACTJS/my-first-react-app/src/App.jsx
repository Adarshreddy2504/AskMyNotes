import Student from "./components/student";
import DOMTimer from "./components/domtimer";

function App() {

  const students=[
    {
      name:"Adarsh",
      course:"CSE",
      year:"2nd Year",
      skill:"React"
    },
    {
      name:"Priyanshu",
      course:"CSE",
      year:"2nd Year",
      skill:"Python"
    },
    {
      name:"Prudhvi",
      course:"CSE",
      year:"2nd Year",
      skill:"Fullstack Developer"
    },
    {
      name:"Pardhu",
      course:"CSE",
      year:"2nd Year",
      skill:""
    },
    {
      name:"Devi Prasad",
      course:"CSE",
      year:"2nd Year",
      skill:"Java"
    }
  ]

  return (
    <div>
      <h1>College Portal</h1>
      <Student students={students}/>
      <DOMTimer />
    </div>
  );
}

export default App;