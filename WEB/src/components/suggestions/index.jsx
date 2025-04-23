import './styles.css'

export function Suggestions({ suggestions, setName, setSearch, Search }){
  return (
    <div className="suggestions">
      {suggestions.map((value, index) => (
        <div key={index}>
          <span
            onClick={() => {
              setName(value);
              setSearch(!Search);
            }}
          >
            {value}
          </span>
          <br />
        </div>
      ))}
    </div>
  )
}