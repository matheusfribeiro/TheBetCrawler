import "../assets/styles/crawler.css";
import { useForm } from "react-hook-form";
import Axios from "axios";

function Crawler() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    Axios.post("http://localhost:5172/testforecho", data)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  return (
    <div className="crawler">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <label>Time</label>
        <input type="text" {...register("team")} />

        <label>Tipo de Aposta</label>
        <select {...register("betType")}>
          <option value="vitoria">Vitória</option>
          <option value="dupla chance">Dupla Chance</option>
          <option value="+1.5">+1.5</option>
          <option value="+2.5">+2.5</option>
        </select>

        <label>Valor</label>
        <input type="number" {...register("amount")} />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Crawler;
