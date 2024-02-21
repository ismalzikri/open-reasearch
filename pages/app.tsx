import type { NextPage } from "next";

const App: NextPage = () => {
  const renderApp = () => {
    return (
      <>
        <div>render</div>
      </>
    );
  };

  return <div className="w-full">render</div>;
};

export default App;
