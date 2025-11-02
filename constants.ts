
import { Goal } from './types';

export const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQkAAABCCAYAAAAlNiv9AAAIQklEQVR4nO2d608bRxTHL7FF8pJs+yJsYh/HcYsbwSgwxigx8UETBEnz4E2hIeARQqEFRW8kHgW86UGLpvEgHjxpaaCg8eBJTSsIIYHgAQKjGPEHnsEjnkFjiD/gwz+Qh45zOztzZ2d2Hjg4yFfW5M3OzM7O/N5r92ZnZ4iY2Hnnnbfb3/72t1v/d/+YMWPGOO+883Z9ff3/23/913/dPnbs2G5ubu7m/5tZ0+eff77t3Lnzdnt7e29vb29vPzz+9Kc/3T7/+c9v/+t//S/bxYsXt9ra2tqDBw9ub29vb7h43rx59uDBg9v333+/ra2t7fnz59tVVVXt7u7u1tZWZsyYMfbss8/udnZ29iuvvLKTJ09uTzzxRBs5cmTbv39/e/bZZ9vZZ5/d7ty5s/3Hf/xH+/TTT7cvv/xy++ijj7ZLLrlke+ihh7Ybb7yxPfzww+2FF17Y/vqv/3r767/+q20u87nPP/98+/DDD7cbb7yxPfDAA9s//+//tT3xxBPtww8/vP3kJz/Znnrqqa2trS3nzp3b/vjHP26//e1vt8suu2T75S9/uZ177rntpZde2n784x+3jz76aPvss8+2tWvXtt27d2+//OUvt3Xr1m3Lli1bHnrooe0HP/hB+/jjj9utt97aPvvsM+2ss85q165du3379u2eeOIJe+GFF7annnqqfeihh7annnqqfeihh/bTn/50O3PmjO3EE09sX3/99Xb++efbiSee2G666ab21FNPhT3wwAPb/v3727/+67+2Tz75ZNuxY8d28+bN7e7u7vbs2bM9++yz7csvv9xee+21/ehHP9reeuut7dNPP90eeOChHXr0t7/9bXvkkUe2jz/+ePvLX/6y/eQnP9l+8pOfbM8//3z71a9+tT3wwAPtO++8s33xi19sr7322nbmmWfW6enpPfjgg3v//v3bGWec0c4777x28uTJ/eMf/7jdf//9e/vtt+/JJ5/c7t27tyeeeGL74he/2D7/+c/vNddc095zzz174okntuuvv34744wz2tNPP70dffTRnXvuuedefvnl7eGHH96eeuqpeeutt/bQQw9t9913X3v55Zf3L//yL3v33Xfv448/vj3zzDP71a9+tT3++OPtueee255++um98MIL+/Wvf73t379/++IXv9jee++9++yzz3bXXXftp59+ut1888277bbbdvPNN+/xxx/fp59+uh133HHtlltu2T744IN2++2372mnndZOOeWU9rWvfW077LBD++KLL9rrrbfeFVdc0a6//vr2+9//frv99tv3q1/9ajvqqKPaRRddtB1wwAHtP//zP/dXXnnl/f3vf99+/vOf7/PPP7/dfffd99RTT/VTTz3Vfvjhh+2yyy7brrvuum+++WYnnnhieeCBB7anS/nwww/bTTfdVB7z+OOPtxNOOKH94he/2L7++us99dRT+/GPf9xOOeWU9vbbb29nn312e/LJJ/frX/96e/fdd3dHH310O/roo9tVV13V3n//ffv1r3+9fe1rX9uOPPJI++c//7nt2LFje/XVV+u///u/tyOPPLJ99NFH94tf/GInnnhi+8c//rG9/PLL+/7779+OPfbYvva1r+2ee+5Znnnmme1HP/pRe/TRR3ci15/+9Kfthhtu2E477bT2/PPPb3fccUeffPLJdsghh7T/+I//sJ1//vl79913t3Xr1rWvf/3rO+CAA/azn/1se/vtt3cPPvhge/fdd/ftt9/eDjnkkPbQQw9tTzzxRFuwYMH20EMPbb/97W83GDBnzpydd955++CDD/ZLL7203XTTTXv++ee3H//4x3vmmWfW6enp3XPPPTf1++jRo9sNN9ywXXXVVdvLL79su+GGG/ZPf/pTmzNnzrZu3bqdOHFi27JlS5uWduzYscPbtm3bDj300P7whz9sf//73+9PPvnkXn311e2VV17ZR4s9f/78dt1117Vdu3Y1GDLggAMOuM8++2xnn312+/jjj9utt966fe1rX9uuvvrqvW/fvv3MM8/sTz/9dHvyySe3jz76aLt169Z2+eWXb6eddlp74403dsstt+ymm27aTjrppLbffvvtiSee2DZv3ryNHDmyzcrK6k033bTNzc1tt956azvjjDPa5Zdfvt1222374osv7l133dXGGFwY0/8B7wXjYhQe6oEAAAAASUVORK5CYII=';

export const SALESPERSON_MISSION = `
A missão do vendedor é simular a primeira chamada de qualificação. O vendedor representa a 'Digital Revolution', uma agência de marketing e vendas que ajuda consultores imobiliários a gerar mais leads de compradores e proprietários.

Um lead qualificado cumpre os seguintes critérios:
- Faturação anual de pelo menos 50.000€ (no último ano ou nos últimos 6 meses).
- Mínimo de 1 ano de experiência no mercado imobiliário.
- Vontade de diversificar os seus canais de prospeção.
- Ambição para aumentar a sua faturação.

O vendedor deve:
- Qualificar o lead com base nos critérios acima.
- Estimular a curiosidade.
- Construir uma relação.
- Agendar uma reunião (se o lead for qualificado).
- Terminar a chamada de forma profissional.
`;

export const AI_GENERAL_CONTEXT = `
Informação geral sobre consultores imobiliários como você:
- Os seus métodos de prospeção habituais são porta-a-porta, angariação direta, círculo de influência pessoal e referências.
- Regra geral, não têm muito conhecimento sobre como o marketing digital funciona.
- Normalmente, quando contactam através de um formulário (como neste caso), é porque não estão a conseguir muitas leads e isso deixa-os apreensivos com o futuro.
`;

export const SALES_SCRIPT_GUIDE = `
**Estrutura da chamada que o vendedor tentará seguir:**
1. Apresentação e verificação se o lead se recorda do anúncio.
2. Pedido de permissão para uma conversa rápida.
3. Perguntas de qualificação: experiência, agência, desafios, experiência com marketing digital, faturação.
4. Contextualização da solução da Digital Revolution.
5. Proposta de agendamento de reunião.
6. Confirmação de detalhes e fecho da chamada.
`;

export const GOALS: Goal[] = [
    { id: 'g1', title: 'Completar 5 Roleplays', description: 'Realize cinco simulações de chamada, independentemente do resultado.', achieved: false },
    { id: 'g2', title: 'Atingir 80% de Eficácia', description: 'Obtenha uma pontuação de eficácia de 80% ou superior numa chamada de dificuldade Média ou Difícil.', achieved: false },
    { id: 'g3', title: 'Agendar 3 Reuniões com Leads Qualificados', description: 'Complete com sucesso o objetivo da chamada agendando uma reunião em 3 cenários com leads qualificados.', achieved: false },
    { id: 'g4', title: 'Superar um Cenário Difícil', description: 'Complete um roleplay no nível Difícil com uma pontuação de eficácia acima de 60%.', achieved: false },
];