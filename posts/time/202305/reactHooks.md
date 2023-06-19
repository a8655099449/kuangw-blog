---
title: react 的自定义 hooks
description: 文章描述
aside: false
date: 2023-06-01
tags:
  - javascript
  - react
---


react hooks 是 react 推出的

## useEcharts

useEcharts 是一个 echart 图表的 hooks

此 hook 提供了以下的功能

1. 自动渲染,以及自动监听 options 的变化而重新渲染
2. 自动监听容器宽高变化重新渲染
3. 组件销毁时，自动销毁示例

:::details 代码详情
```tsx
import type { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

type useEchartProps = {
  options: Partial<echarts.EChartsCoreOption>;
  onCreateInstance?: (e: ECharts) => void; // 创建实例的回调
  manual?: boolean; // 是否手动去设置options
};

const useEchart = ({
  options = {},
  onCreateInstance,
  manual = false,
}: useEchartProps) => {
  const instance = useRef<ECharts>();
  const wrapDom = useRef<HTMLDivElement>(null);
  const ref = useRef({
    options: {} as any,
    isRender: false,
  });

  const resize = () => instance.current?.resize();

  const refresh = () => {
    instance.current?.setOption({ ...ref.current.options });
    if (!ref.current.isRender) {
      setTimeout(() => {
        ref.current.isRender = true;
      }, 1000);
    }
  };
  useEffect(() => {
    if (!wrapDom.current) {
      return;
    }
    const echartInstance = echarts.init(wrapDom.current) as ECharts;

    instance.current = echartInstance;

    if (!manual) {
      ref.current.options = options;
      refresh();
    }
    onCreateInstance?.(echartInstance);

    const ro = new ResizeObserver(() => {
      console.log(`resize`);
      if (!ref.current.isRender) {
        return;
      }

      resize();
    });
    ro.observe(wrapDom.current);

    return () => {
      instance.current?.dispose();
      ro.disconnect();
    };
  }, [wrapDom]);

  useEffect(() => {
    if (instance.current) {
      ref.current.options = { ...options };
      refresh();
    }
  }, [options, instance]);
  return {
    wrapDom,
    instance,
    refresh,
  };
};

export default useEchart;
```
:::

**使用示例**


```jsx
import React from 'react'
import useEchart from './useEcharts'
const Echart = (props) =>{

  const {wrapDom} = useEchart({
    options:{
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    }
  })
  return(
    <div ref={wrapDom} style={{
      height:500
    }}>
      
    </div>
  )
}
export default Echart
```


## useG6
useG6 是一个配合[antv-g6](https://g6.antv.antgroup.com/)使用的 hooks，提供了一些便捷的功能

:::details
```ts
/**
 * @name useAppCardTopology
 * @createDate 2022-11-23
 * @author kuangw 865509949@qq.com
 * @description 卡片式Dom
 */

import type { Graph, GraphOptions } from '@antv/g6';
import G6, { Arrow } from '@antv/g6';
import { useEffect, useRef } from 'react';
import { registerDefaultCard } from './registerNode';
registerDefaultCard()
type AppItem = any

export type useAppCardTopologyParams = {
  onCreated?: (g: Graph) => any; // g6实例被创建
  g6Options?: Partial<GraphOptions>; // 自定义的g6选项
  lineType?: 'line' | 'polyline'; // 额外线的类型
  onClickItem?: (a: AppItem) => any; // 点击item的事件
  showSnapLine?: boolean; // 是否展示辅助线
};

const useAppCardTopology = ({
  onCreated,
  g6Options = {},
  onClickItem,
  showSnapLine,
}: useAppCardTopologyParams) => {
  const dom = useRef<HTMLDivElement>(null);
  const ref = useRef<{ g: Graph }>({
    g: {} as Graph,
  });

  // 容器发生变化改变拓扑大小

  const resize = () => {
    if (dom.current?.clientWidth && ref.current.g) {
      ref.current.g.changeSize(dom.current?.clientWidth, dom.current?.clientHeight);
    }
  };
  // 渲染拓扑图

  const render = () => {
    const plugins: any[] = [];
    if (showSnapLine) {
      const snapLine = new G6.SnapLine({
        line: {
          stroke: 'red',
          lineWidth: 3,
        },
        itemAlignType: true,
      });
      plugins.push(snapLine);
    }

    const width = dom.current!.scrollWidth;
    const height = dom.current!.scrollHeight || 500;
    const graph = new G6.TreeGraph({
      container: dom.current as HTMLDivElement,
      layout: {
        type: 'mindmap',
        direction: 'H',
        getHeight: () => {
          return 16;
        },
        getWidth: () => {
          return 16;
        },
        getVGap: () => {
          return 10;
        },
        getHGap: () => {
          return 50;
        },
      },
      defaultNode: {
        size: 26,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        type:'root'
      },
      width,
      height,
      defaultEdge: {
        type: 'cubic-horizontal',
      },
      modes: {
        default: [
          {
            type: 'collapse-expand',
            onChange: function onChange(item:any, collapsed) {
              const data = item.get('model');
              data.collapsed = collapsed;
              return true;
            },
          },
          'drag-canvas',
          'zoom-canvas',
        ],
      },
   
      ...g6Options,
    });
    
    onCreated?.(graph);
    ref.current.g = graph;

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(dom.current!);
    if (onClickItem) {
      graph.on('node:click', (e) => {
        onClickItem(e.item?._cfg?.model as AppItem);
      });
      graph.on('node:touchstart', (e) => {
        onClickItem(e.item?._cfg?.model as AppItem);
      });
    }
  };

  // 写在拓扑
  const unMount = () => {
    ref.current.g.destroy();
  };
  // 出现渲染拓扑
  const reload = () => {
    unMount();
    render();
  };

  useEffect(() => {
    if (!dom.current) {
      return;
    }
    window.addEventListener('resize', resize);
    render();
    return () => {
      unMount();
      window.removeEventListener('resize', resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { dom, reload };
};

export default useAppCardTopology;

```
:::