import { useEffect, useState } from "react";
import stringService from "../services/string-service";
import { CanceledError } from "../services/api-client";


const useString = () =>{
    const [string, setString] = useState<string[]>([]);
    const [strError, setStrError] = useState("");
    const [strIsLoading, setStrIsLoading] = useState(false);
  
    useEffect(() => {
      setStrIsLoading(true);
  
      const { request, cancel } = stringService.getAll<string>();
      request
        .then((res) => {
          setString(res.data);
          setStrIsLoading(false);
        })
        .catch((err) => {
          if (err instanceof CanceledError) return;
          setStrError(err.message);
          setStrIsLoading(false);
        });
  
      return () => cancel();
    }, []);

    return { string, strError, strIsLoading, setString, setStrError };
}

export default useString;
