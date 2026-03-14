'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, KeywordRanking, MonthlyPlan, mockTasks, mockKeywords, mockPlans } from './data';

interface DataContextType {
  tasks: Task[];
  keywords: KeywordRanking[];
  plans: MonthlyPlan[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addKeyword: (keyword: Omit<KeywordRanking, 'id' | 'history' | 'currentRank' | 'previousRank'>) => void;
  addPlan: (plan: Omit<MonthlyPlan, 'id' | 'progress'>) => void;
  updatePlan: (id: string, plan: Partial<MonthlyPlan>) => void;
  deletePlan: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [keywords, setKeywords] = useState<KeywordRanking[]>(mockKeywords);
  const [plans, setPlans] = useState<MonthlyPlan[]>(mockPlans);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks([newTask, ...tasks]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...taskData } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addKeyword = (kwData: Omit<KeywordRanking, 'id' | 'history' | 'currentRank' | 'previousRank'>) => {
    const newKeyword: KeywordRanking = {
      ...kwData,
      id: Math.random().toString(36).substr(2, 9),
      history: [],
      currentRank: 0,
      previousRank: 0,
    };
    setKeywords([newKeyword, ...keywords]);
  };

  const addPlan = (planData: Omit<MonthlyPlan, 'id' | 'progress'>) => {
    const newPlan: MonthlyPlan = {
      ...planData,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
    };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, planData: Partial<MonthlyPlan>) => {
    setPlans(plans.map(p => p.id === id ? { ...p, ...planData } : p));
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const computedPlans = plans.map(plan => {
    const planTasks = tasks.filter(t => t.month === plan.month);
    const totalTasks = planTasks.length;
    const completedTasks = planTasks.filter(t => t.status === 'done').length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    return { ...plan, progress };
  });

  return (
    <DataContext.Provider value={{ 
      tasks, 
      keywords, 
      plans: computedPlans, 
      addTask, 
      updateTask, 
      deleteTask, 
      addKeyword, 
      addPlan, 
      updatePlan, 
      deletePlan 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
