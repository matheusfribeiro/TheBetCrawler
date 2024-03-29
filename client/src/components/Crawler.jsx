import "../assets/styles/crawler/crawler.css";
import { useForm, useFieldArray } from "react-hook-form";
import Axios from "axios";

function Crawler() {
  const { register, handleSubmit, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "bets",
  });

  // Initialize the form with one bet field
  if (fields.length === 0) {
    append({ team: "", betType: "vitoria"});
  }

  const onSubmit = (data) => {
    console.log(data);
    Axios.post("http://localhost:5172/testforecho", data)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <div className="crawler">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Crawler</h2>
        {fields.map((field, index) => (
          <div key={field.id} className="bet-container">
            <label>Time</label>
            <input type="text" required {...register(`bets[${index}].team`)} />

            <label>Tipo de Aposta</label>
            <select
              {...register(`bets[${index}].betType`)}
              defaultValue="vitoria"
            >
              <option value="vitoria">Vitória</option>
              <option value="dupla chance">Dupla Chance</option>
              <option value="+1.5">+1.5</option>
              <option value="+2.5">+2.5</option>
              <option value="ambas">Ambas sim</option>
              <option value="nao ambas">Ambas não</option>
            </select>

            {index > 0 && (
              <button type="button" onClick={() => remove(index)}>
                Remover Aposta
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ team: "", betType: "vitoria"})}
        >
          Adicionar Aposta
        </button>

        <label>Valor</label>
        <input type="number" required {...register("betAmount")} />

        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
}

export default Crawler;
