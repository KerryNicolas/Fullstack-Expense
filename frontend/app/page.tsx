"use client"
import { useState, useEffect, } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { ArrowDownCircle, ArrowUpCircle, TrendingDown, TrendingUp, Wallet, Activity, Trash, PlusCircle } from "lucide-react";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [text, setText] = useState<string>("");
  const [amount, setAmount] = useState<number  | "" >("")
  const [loading, setLoading] = useState(false)

  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/")
      setTransactions(res.data)
      toast.success("Transactions chargées")
    } catch (error) {
      console.error("Erreur chargement transactions", error);
      toast.error("Erreur lors du chargement")
    }
  }



  const deleteTransactions = async (id: string) => {
    try {
      await api.delete(`transactions/${id}/`)
      toast.success("Transactions supprimeé avec succès")
    } catch (error) {
      console.error("Erreur suppression transactions", error);
      toast.error("Erreur suppression chargement")
    }
  }

  const addTransactions = async () => {
    if( !text || amount == "" ||isNaN(Number(amount))) {
      toast.error("Merci de remplir texte et montant valides")
    return
  }
    setLoading(true)
    try {
      const res = await api.post <Transaction>(`transactions/`, {text, amount : Number(amount)})
      getTransactions()
      const modal = document.getElementById('my_modal_3')as HTMLDialogElement
      if (modal) {
        modal.close()
      }
      toast.success("Transactions Ajoutée avec succès")
      setText("")
      setAmount("")
    } catch (error) {
      console.error("Erreur ajout transactions", error);
      toast.error("Erreur ajout chargement")
    }finally {
        setLoading(false)
    }
  }


  useEffect(() => {
    getTransactions();
  }, []);


  const amounts = transactions.map((t) => Number(t.amount) || 0)
  const balance = amounts.reduce ((acc, item)=> acc + item ,0) || 0
  const income = amounts.filter((a)=> a > 0).reduce((acc, item)=> acc + item ,0) || 0
  const expense = amounts.filter((a)=> a < 0).reduce((acc, item)=> acc + item ,0) || 0
  const ratio = income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0


  const formatDate = (dateString: string) => {
    const d= new Date (dateString);
    return d.toLocaleDateString ("fr-FR", {
      year: "numeric",
      month: "short",
      day:"numeric",
      hour:"2-digit",
      minute:"2-digit",
    });
  };


  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft" >
            < Wallet className="w-4 h4"/>
            votre solde
          </div>
          <div className="stat-value">
            {balance.toFixed(2)} Ar
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-success" >
            < ArrowUpCircle className="w-4 h4"/>
            Revenus
          </div>
          <div className="stat-value">
            {income.toFixed(2)} Ar
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-error" >
            < ArrowDownCircle className="w-4 h4"/>
            Dépenses
          </div>
          <div className="stat-value">
            {expense.toFixed(2)} Ar
          </div>
        </div>

      </div>
      <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
        <div className="flex flex-col gap-2">


  <div className="flex justify-between items-center">
    <div className="badge badge-soft badge-warning gap-1">
      <Activity className="w-4 h-4"/>
      Dépenses VS Revenus
    </div>
    <span className="text-sm font-bold">{ratio.toFixed(0)}%</span>
  </div>

  <div className="w-full bg-warning/20 rounded-full h-6 overflow-hidden">
    <div
      className="bg-warning h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
      style={{ width: `${ratio}%` }}
    >
      {ratio.toFixed(0)}%
    </div>
  </div>

</div>
      </div>

        {/* You can open the modal using document.getElementById('ID').showModal() method */}
            
            <button className="btn btn-warning" 
            onClick={()=>(document.getElementById('my_modal_3')as HTMLDialogElement).showModal()}>
            <PlusCircle className="w-4 h-4"/>
            Ajouter une Transaction
            </button> 
            
        <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5">
        
            <dialog id="my_modal_3" className="modal backdrop-blur">
              <div className="modal-box border-2 border-warning/40">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                          <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4"> Ajouter une Transaction</p>
                <div className="flex flex-col gap-4 mt-3">

                  <div className="flex flex-col gap-2">
                    <label className="label">Test</label>
                    <input 
                    type="text" 
                    name="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter le texte..."
                    className="input w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="label">Montant (négatif - dépense, positif - revenu)</label>
                    <input 
                    type="number" 
                    name="amount" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value=== "" ? "": Number(e.target.value))}
                    placeholder="Enter le montant..."
                    className="input w-full"
                    />
                  </div>
                  <button 
                    className="w-full btn btn-warning "
                    onClick ={addTransactions}
                    disabled = {loading}>
                    <PlusCircle className="w-4 h-4"/>
                    Ajouter
                  </button>

                </div>
              </div>
            </dialog>
        <table className="table">
        

    {/* head */}
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Montant</th>
        <th> Date </th>
         <th> Action </th>
      </tr>
    </thead>
    
    <tbody>

     {transactions.map((t , index) => (
      <tr
      key = {t.id}
      >
        <th> {index + 1} </th>
        <td> {t.text} </td>
        <td className="front-semibold flex items-center gap-2"> 
          {t.amount > 0 ? (
              <TrendingUp className="text-success  w-6 h-6"/>
          ):(
              <TrendingDown className="text-error w-6 h-6"/>
          )}
          {t.amount > 0 ? `+${t.amount}`: `${t.amount}`}
        </td>
        <td>
          {formatDate(t.created_at)}
        </td>
        <td>
          <button 
          onClick={()=>deleteTransactions(t.id)}
          className="btn btn-sm btn-error btn-soft">
            <Trash className="w-4 h-4"/>
          </button>
        
        </td>
      </tr>
     ))}

    </tbody>
  </table>
</div>

    </div>
  );
}
