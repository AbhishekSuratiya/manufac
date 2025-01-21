import MinMaxCropProduction from "../components/minMaxCropProduction.tsx";
import AverageCropYields from "../components/averageCropYields.tsx";

const Home = () => {
  return <div style={{maxWidth: '80vw'}}>
    <div>
      <MinMaxCropProduction/>
      <AverageCropYields/>
    </div>
  </div>
}

export default Home;