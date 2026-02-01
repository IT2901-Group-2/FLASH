FROM python:3.13 as builder
WORKDIR /app

RUN git clone https://github.com/googleapis/storage-testbench.git .
RUN python -m venv /venv
ENV PATH="/venv/bin:$PATH"
RUN pip install .

FROM python:3.13-slim
WORKDIR /app

COPY --from=builder /app .
COPY --from=builder /venv /venv
ENV PATH="/venv/bin:$PATH"

EXPOSE 9000
ENTRYPOINT ["python", "testbench_run.py", "0.0.0.0", "9000", "4"]
