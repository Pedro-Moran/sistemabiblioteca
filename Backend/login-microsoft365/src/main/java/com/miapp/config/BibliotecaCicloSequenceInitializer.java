package com.miapp.config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class BibliotecaCicloSequenceInitializer {

    private final JdbcTemplate jdbcTemplate;

    public BibliotecaCicloSequenceInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void initializeSequence() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM USER_SEQUENCES WHERE SEQUENCE_NAME = 'SEQ_BIBLIOTECACICLO'",
                Integer.class);
        Long max = jdbcTemplate.queryForObject(
                "SELECT COALESCE(MAX(IDBIBLIOTECACICLO),0) FROM BIBLIOTECACICLO",
                Long.class);
        long next = (max == null ? 0 : max) + 1;
        if (count != null && count == 0) {
            jdbcTemplate.execute(
                    "CREATE SEQUENCE SEQ_BIBLIOTECACICLO START WITH " + next + " INCREMENT BY 1 NOCACHE NOCYCLE");
        } else {
            Long seqNext = jdbcTemplate.queryForObject(
                    "SELECT LAST_NUMBER FROM USER_SEQUENCES WHERE SEQUENCE_NAME = 'SEQ_BIBLIOTECACICLO'",
                    Long.class);
            if (seqNext != null && seqNext < next) {
                long diff = next - seqNext;
                jdbcTemplate.execute("ALTER SEQUENCE SEQ_BIBLIOTECACICLO INCREMENT BY " + diff);
                jdbcTemplate.queryForObject("SELECT SEQ_BIBLIOTECACICLO.NEXTVAL FROM dual", Long.class);
                jdbcTemplate.execute("ALTER SEQUENCE SEQ_BIBLIOTECACICLO INCREMENT BY 1");
            }
        }
    }
}