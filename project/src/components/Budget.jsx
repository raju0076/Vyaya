import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBudget } from "../redux/actions/budgetActions";
import { IndianRupee, TrendingUp, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Budget = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.expenses) || [];
  const currentBudget = useSelector((state) => state.budget.budget);

  const [budgetInput, setBudgetInput] = useState(currentBudget || "");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const inputRef = useRef(null);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );
  const remaining = currentBudget - totalExpenses;

  useEffect(() => {
    if (currentBudget > 0 && remaining / currentBudget <= 0.1 && remaining > 0) {
      setShowAlert(true);
    }
  }, [remaining, currentBudget]);

  const handleSubmit = () => {
    const newBudget = Number(budgetInput);
    if (newBudget > 0) {
      dispatch(setBudget(newBudget));
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleNewBudget = () => {
    setBudgetInput("");
    dispatch(setBudget(0));
  };

  const getProgressColor = () => {
    const percentage = (totalExpenses / currentBudget) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-xl backdrop-blur-md border border-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              ref={inputRef}
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              type="number"
              placeholder="Enter your budget amount"
            />
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Set Budget
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNewBudget}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              New Budget
            </motion.button>
          </div>
        </div>

        {currentBudget > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Budget Progress</span>
              <span className="text-sm text-gray-500">
                {Math.min(((totalExpenses / currentBudget) * 100), 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalExpenses / currentBudget) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-3 rounded-full ${getProgressColor()}`}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide">
                  Total Budget
                </p>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center mt-1">
                  <IndianRupee size={20} />
                  {currentBudget.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <TrendingUp className="text-indigo-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-semibold text-sm uppercase tracking-wide">
                  Total Expenses
                </p>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center mt-1">
                  <IndianRupee size={20} />
                  {totalExpenses.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/30 relative"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">
                  Remaining
                </p>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center mt-1">
                  <IndianRupee size={20} />
                  {remaining.toLocaleString("en-IN")}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            
            <AnimatePresence>
              {showCelebration && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"][i % 4],
                        left: `${20 + Math.random() * 60}%`,
                        top: "50%",
                      }}
                      initial={{ scale: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1, 0],
                        y: [-50, -100, -150],
                        opacity: [1, 0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="text-red-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  ⚠️ Low Balance Alert!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your remaining balance is{" "}
                  <span className="font-bold text-red-600">
                    ₹{remaining.toLocaleString("en-IN")}
                  </span>. Please monitor your expenses carefully.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAlert(false)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};