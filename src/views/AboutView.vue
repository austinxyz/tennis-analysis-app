<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/ui/button.vue';
import Card from '../components/ui/card.vue';
import CardHeader from '../components/ui/card-header.vue';
import CardTitle from '../components/ui/card-title.vue';
import CardDescription from '../components/ui/card-description.vue';
import CardContent from '../components/ui/card-content.vue';
import CardFooter from '../components/ui/card-footer.vue';
import { Activity, Users, Trophy, BarChart } from 'lucide-vue-next';

const features = ref([
  {
    title: 'USTA 联赛队伍分析',
    description: '分析USTA联赛队伍数据，帮助您了解队伍实力和表现。',
    icon: Users,
    route: '/usta'
  },
  {
    title: 'UTR 比赛及球员数据分析',
    description: '分析UTR比赛和球员数据，帮助您了解球员实力和表现。',
    icon: Activity,
    route: '/utr'
  },
  {
    title: '紫荆杯分析',
    description: '分析紫荆杯比赛数据，帮助您了解比赛情况和球员表现。',
    icon: Trophy,
    route: '/zijing'
  },
  {
    title: '活动',
    description: '查看和管理网球活动，包括比赛和训练。',
    icon: BarChart,
    route: '/event'
  }
]);
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">欢迎使用网球分析系统</h1>
      <p class="text-xl text-muted-foreground">全面的网球数据分析平台，助您提升比赛表现</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card v-for="feature in features" :key="feature.title" class="flex flex-col h-full">
        <CardHeader>
          <div class="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <component :is="feature.icon" class="w-6 h-6 text-primary" />
          </div>
          <CardTitle>{{ feature.title }}</CardTitle>
          <CardDescription>{{ feature.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-grow">
          <!-- 可以在这里添加更多内容 -->
        </CardContent>
        <CardFooter>
          <Button class="w-full" @click="$router.push(feature.route)">
            查看详情
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
