import Header from "../components/Header";
import { useState, useEffect } from "react";
import { TextInput } from "@tremor/react";
import { Button, Dialog, DialogPanel } from "@tremor/react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const nicknameLocal = localStorage.getItem("nickname");
    if (!nicknameLocal) {
      navigate("/");
    } else {
      setNickname(nicknameLocal);
    }
  }, []);
  return (
    <div>
      <Header nickname={nickname} />
      <p> Blue</p>
    </div>
  );
}

export default Home;
