Indicateur KPI) :
​Actions en retard : Count(DISTINCT {<[Flag_Action_Completed]={0}, [Real_Days_Before_Due_Date]={'<0'}>} [Action id])  
​Échéance < 15 jours : Count(DISTINCT {<[Flag_Action_Completed]={0}, [Real_Days_Before_Due_Date]={'>=0<=15'}>} [Action id])  
​Extensions demandées : Sum([Flag_Extension_Requested])  