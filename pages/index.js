import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
import dayjs from "dayjs";
import Head from "next/head";
import Results from "../components/Results";
import MCTForm from "../components/MCTForm";

const Home = ({ data: myData }) => {
  const [results, setResults] = useState(myData);

  const onChange = (e) => {
    const data = { ...results };
    let name = e.target.name;
    let resultType = name.split(" ")[0].toLowerCase();
    let resultMacro = name.split(" ")[1].toLowerCase();
    data[resultMacro][resultType] = e.target.value;
    setResults(data);
  };

  const getDataForPreviousDay = async () => {
    let currentDate = dayjs(results.date);
    let newDate = currentDate.subtract(1, "day").format("YYYY-MM-DDTHH:mm:ss");
    const res = await fetch(
      "https://macro-compliance-tracker-gold.vercel.app/api/daily?date=" +
        newDate
    );
    const json = await res.json();

    setResults(json);
  };

  const getDataForNextDay = async () => {
    let currentDate = dayjs(results.date);
    let newDate = currentDate.add(1, "day").format("YYYY-MM-DDTHH:mm:ss");
    const res = await fetch(
      "https://macro-compliance-tracker-gold.vercel.app/api/daily?date=" +
        newDate
    );
    const json = await res.json();

    setResults(json);
  };

  const updateMacros = async () => {
    const res = await fetch(
      "https://macro-compliance-tracker-gold.vercel.app/api/daily",
      {
        method: "POST",
        body: JSON.stringify(results),
      }
    );
  };

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container max-w-screen-xl	 mx-auto">
        <div className="flex text-center">
          <div className="w-full m-4">
            <h1 className="text-4xl">Macro Compliance Tracker</h1>
          </div>
        </div>

        <div className="flex text-center">
          <div className="w-1/3 bg-gray-200 p-4">
            <button onClick={getDataForPreviousDay}>Previous Day</button>
          </div>
          <div className="w-1/3 p-4">
            {dayjs(results.date).format("MM/DD/YYYY")}
          </div>
          <div className="w-1/3 bg-gray-200 p-4">
            <button onClick={getDataForNextDay}>Next Day</button>
          </div>
        </div>

        <div className="flex mb-4 text-center">
          <Results results={results.calories} />
          <Results results={results.carbs} />
          <Results results={results.fat} />
          <Results results={results.protein} />
        </div>

        <div className="flex text-center">
          <MCTForm data={results} item="Total" onChange={onChange} />
          <MCTForm data={results} item="Target" onChange={onChange} />
          <MCTForm data={results} item="Variant" onChange={onChange} />
        </div>

        <div className="flex text-center">
          <div className="w-full m-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={updateMacros}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context) {
  const res = await fetch(
    "https://macro-compliance-tracker-gold.vercel.app/api/daily"
  );
  const json = await res.json();
  return {
    props: {
      data: json,
    },
  };
}

export default Home;
