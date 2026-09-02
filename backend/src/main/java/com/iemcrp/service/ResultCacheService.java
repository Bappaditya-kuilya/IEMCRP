package com.iemcrp.service;

import com.iemcrp.model.Result;
import com.iemcrp.repository.ResultRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class ResultCacheService {

    private final ResultRepository resultRepository;
    private final StringRedisTemplate redisTemplate;

    public ResultCacheService(ResultRepository resultRepository, StringRedisTemplate redisTemplate) {
        this.resultRepository = resultRepository;
        this.redisTemplate = redisTemplate;
    }

    public void preComputeExamResults(UUID examId) {
        List<Result> results = resultRepository.findByExamId(examId);
        for (Result result : results) {
            String key = String.format("result:%s:%s", result.getStudent().getId(), examId);
            String value = String.format(
                "{\"subjectCode\":\"%s\",\"subjectName\":\"%s\",\"marks\":%d,\"maxMarks\":%d,\"grade\":\"%s\"}",
                result.getSubjectCode(),
                result.getSubjectName(),
                result.getMarksObtained(),
                result.getMaxMarks(),
                result.getGrade() != null ? result.getGrade() : ""
            );
            redisTemplate.opsForValue().set(key, value, 7, TimeUnit.DAYS);
        }
    }

    public String getCachedResult(UUID studentId, UUID examId) {
        String key = String.format("result:%s:%s", studentId, examId);
        return redisTemplate.opsForValue().get(key);
    }
}
