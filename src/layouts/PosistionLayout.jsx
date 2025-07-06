// src/pages/DepartmentLayout.jsx
import React from "react";
import Headline from "../layouts/Headline";
import PositionList from "../pages/PositionList"; // đường dẫn đúng

export default function DepartmentLayout() {
  return (
    <div>
      <Headline content="Danh sách các vị trí" />
      <PositionList />
    </div>
  );
}
