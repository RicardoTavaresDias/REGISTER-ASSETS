import './styles.css'

export function Input({ value, onChange, placeholder, children }){
  return (
    <div className='inputText'>
      <label>{children}</label>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}