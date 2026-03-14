'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task, KeywordRanking, MonthlyPlan, mockTasks, mockKeywords, mockPlans } from './data';

interface DataContextType {
  tasks: Task[];
  keywords: KeywordRanking[];
  plans: MonthlyPlan[];
  addTask: (task: Omit<Task, 'id'>) => void;
  addKeyword: (keyword: Omit<KeywordRanking, 'id' | 'history' | 'currentRank' | 'previousRank'>) => void;
  addPlan: (plan: Omit<MonthlyPlan, 'id' | 'progress'>) => void;
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

  return (
    <DataContext.Provider value={{ tasks, keywords, plans, addTask, addKeyword, addPlan }}>
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
