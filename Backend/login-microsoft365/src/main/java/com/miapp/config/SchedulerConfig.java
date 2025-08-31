package com.miapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
<<<<<<< HEAD
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
=======
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
@EnableScheduling
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
public class SchedulerConfig {
    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler ts = new ThreadPoolTaskScheduler();
        ts.setPoolSize(5);
        ts.setThreadNamePrefix("sched-");
        return ts;
    }
}
