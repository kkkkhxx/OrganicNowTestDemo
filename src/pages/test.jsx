import SideBar from "../component/sidebar";
import Layout from "../layouts/MainLayout";

function Test() {
  return (
    <Layout>
      <div className="container">
        <SideBar />
        <h1>Test</h1>
      </div>
    </Layout>
  );
};
export default Test;
